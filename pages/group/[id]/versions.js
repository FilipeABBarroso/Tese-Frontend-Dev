import { useRouter } from 'next/router'
import ShowVersions from "../../../components/Templates/ShowVersions"; 
 
export default function GroupEntities() {
  const router = useRouter()
  return (
    <ShowVersions tag={router.query.id?.split('-v')[0]} version={router.query.id?.split('-v')[1]}/>
  );
}
