import ShowGroup from "../components/Templates/Group";

function Group({ tag }) {
  return (
    <ShowGroup tag={tag}/>
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

export default Group;