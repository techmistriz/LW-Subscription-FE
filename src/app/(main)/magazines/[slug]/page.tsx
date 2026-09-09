import MagazineDetailPage from "@/features/magazines/components/MagazineDetailPage";

type Props = {
  params: { slug: string }; //  plain object, not a Promise
};

export default function Page({ params }: Props) {
  return <MagazineDetailPage params={params} />;
}
