import { useRouter } from 'next/router'
import ShowEntityGroups from "../../../components/Templates/ShowEntityGroups"; 
 
export default function EntityGroups() {
  const router = useRouter()
  return (
    <ShowEntityGroups acronym={router.query.id}/>
  );
}
