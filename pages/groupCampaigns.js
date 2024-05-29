import ShowGroupCampaigns from "../components/Templates/ShowGroupCampaigns";

function groupCampaigns({ tag }) {
  return (
    <ShowGroupCampaigns tag={tag}/>
  );
}


export async function getServerSideProps(context) {
  const { tag } = context.query;
  return {
    props: {
      tag,
    },
  };
}

export default groupCampaigns;
