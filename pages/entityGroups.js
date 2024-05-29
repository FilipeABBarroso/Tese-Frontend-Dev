import ShowEntityGroups from "../components/Templates/ShowEntityGroups";

function EntityGroups({ entityName, entityAcronym, entityUrl }) {
  return (
    <ShowEntityGroups entityName={entityName} entityAcronym={entityAcronym} entityUrl={entityUrl} />
  );
}

export async function getServerSideProps(context) {
  const { data1, data2, data3 } = context.query;
  return {
    props: {
      entityName: data1,
      entityAcronym: data2,
      entityUrl: data3,
    },
  };
}

export default EntityGroups;
