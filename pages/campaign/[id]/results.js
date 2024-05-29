import { useRouter } from 'next/router'
import ShowCampaignResults from "../../../components/Templates/ShowCampaignResults"; 
 
export default function CampaignResults() {
  const router = useRouter()
  return (
    <ShowCampaignResults tag={router.query.id}/>
  );
}
