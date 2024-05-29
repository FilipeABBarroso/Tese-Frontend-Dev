import { useRouter } from 'next/router'
import ShowGroup from "../../components/Templates/Group"; 
 
export default function Group() {
  const router = useRouter()
  return (
    <h1>{router.query.id}</h1>
  );
}
