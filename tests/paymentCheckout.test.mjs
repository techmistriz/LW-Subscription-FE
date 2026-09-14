import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Exercise the production checkout helper with the browser and Razorpay SDK replaced.
function checkoutHarness(mode = "success") {
  const stored = new Map();
  const opened = [];
  const sessionStorage = {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value),
    removeItem: (key) => stored.delete(key),
  };
  class Razorpay {
    constructor(options) {
      this.options = options;
    }
    on() {}
    open() {
      opened.push(this.options);
      if (mode === "dismiss") this.options.modal.ondismiss();
      else
        this.options.handler({
          razorpay_payment_id: "pay_1",
          razorpay_order_id: "order_1",
          razorpay_signature: "signature",
        });
    }
  }
  const exports = {};
  const source = ts.transpileModule(
    fs.readFileSync("src/lib/paymentCheckout.ts", "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    },
  ).outputText;
  vm.runInNewContext(source, {
    exports,
    sessionStorage,
    window: { Razorpay, setTimeout, clearTimeout },
    require: (name) => {
      assert.equal(name, "sonner");
      return { toast: { info() {}, error() {} } };
    },
  });
  return { ...exports, opened, stored };
}

const data = {
  subscription: { id: 1, status: "PENDING" },
  payment: {
    gateway: "RAZORPAY",
    razorpay_key: "test_key",
    order_id: "order_1",
    amount: 11801,
    currency: "INR",
  },
};
const confirmed = {
  status: true,
  data: { payment_confirmed: true, subscription: { id: 1, status: "ACTIVE" } },
};

test("uses the server order and paise amount, then verifies before success", async () => {
  const checkout = checkoutHarness();
  let verified = false;
  const result = await checkout.completeCheckout(data, {}, async (payload) => {
    assert.equal(payload.razorpay_order_id, "order_1");
    verified = true;
    return confirmed;
  });
  assert.equal(verified, true);
  assert.equal(result.status, "ACTIVE");
  assert.equal(checkout.opened[0].amount, 11801);
  assert.equal(checkout.stored.size, 0);
});

test("dismissal leaves the subscription pending without verification", async () => {
  const checkout = checkoutHarness("dismiss");
  const result = await checkout.completeCheckout(data, {}, () =>
    assert.fail("dismissal must not confirm payment"),
  );
  assert.equal(result, null);
});

test("network failure retries verification without opening another checkout", async () => {
  const checkout = checkoutHarness();
  const verifying = [];
  await assert.rejects(
    checkout.completeCheckout(
      data,
      {},
      async () => {
        throw new Error("offline");
      },
      (value) => verifying.push(value),
    ),
    /offline/,
  );
  assert.deepEqual(verifying, [true, false]);
  await checkout.completeCheckout(data, {}, async () => confirmed);
  assert.equal(checkout.opened.length, 1);
});

test("authorized payment does not produce a success result", async () => {
  const checkout = checkoutHarness();
  await assert.rejects(
    checkout.completeCheckout(data, {}, async () => ({
      status: true,
      message: "Awaiting capture",
      data: { payment_confirmed: false },
    })),
    /Awaiting capture/,
  );
  assert.equal(checkout.stored.size, 1);
});

test("a server-confirmed failure permits a fresh attempt on the same order", async () => {
  const checkout = checkoutHarness();
  await assert.rejects(
    checkout.completeCheckout(data, {}, async () => ({
      status: true,
      message: "Payment failed",
      data: { payment_confirmed: false, payment_status: "FAILED" },
    })),
    /Payment failed/,
  );
  await checkout.completeCheckout(data, {}, async () => confirmed);
  assert.equal(checkout.opened.length, 2);
  assert.equal(checkout.opened[1].order_id, "order_1");
});

test("completed purchases recovered by a webhook do not open checkout", async () => {
  const checkout = checkoutHarness();
  const result = await checkout.completeCheckout(
    { ...data, payment: null, payment_confirmed: true },
    {},
    () => assert.fail("already paid"),
  );
  assert.equal(result.id, 1);
  assert.equal(checkout.opened.length, 0);
});

test("missing payment options never imply a successful payment", async () => {
  const checkout = checkoutHarness();
  await assert.rejects(
    checkout.completeCheckout({ ...data, payment: null }, {}, () =>
      assert.fail("missing checkout"),
    ),
    /still pending/,
  );
});
