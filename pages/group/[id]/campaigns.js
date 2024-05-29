import { useRouter } from 'next/router'
import ShowGroupCampaigns from "../../../components/Templates/ShowGroupCampaigns"; 
 
export default function GroupCampaigns() {
  const router = useRouter()
  return (
    <ShowGroupCampaigns tag={router.query.id}/>
  );
}
