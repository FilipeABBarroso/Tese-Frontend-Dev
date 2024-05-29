import UpdateEntity from "../components/Templates/UpdateEntity";

function updateEntity({ name, acronym, url }) {
  return (
    <UpdateEntity name={name} acronym={acronym} url={url}/>
  );
}

export async function getServerSideProps(context) {
  const { data1, data2, data3 } = context.query;

  return {
    props: {
      name: data1,
      acronym: data2,
      url: data3,
    },
  };
}

export default updateEntity;