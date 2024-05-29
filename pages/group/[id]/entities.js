import { useRouter } from 'next/router'
import ShowGroup from "../../../components/Templates/Group"; 
 
export default function GroupEntities() {
  const router = useRouter()
  console.log(router.query.id);
  return (
    <ShowGroup tag={router.query.id?.split('-v')[0]} version={router.query.id?.split('-v')[1]}/>
  );
}
