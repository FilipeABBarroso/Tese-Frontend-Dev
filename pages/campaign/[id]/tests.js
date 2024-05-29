import { useRouter } from 'next/router'
import ShowCampaignTests from "../../../components/Templates/CampaignTests"; 
 
export default function CampaignTests() {
  const router = useRouter()
  return (
    <ShowCampaignTests tag={router.query.id}/>
  );
}
