import { useRouter } from 'next/router'
import CreateCampaign from "../../../components/Templates/CreateCampaign"; 
 
export default function CampaignWithArgs() {
  const router = useRouter()
  console.log(router.query.id);
  return (
    <CreateCampaign receivedTag={router.query.id?.split('-v')[0]} receivedVersion={router.query.id?.split('-v')[1]}/>
  );
}
