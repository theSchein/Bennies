import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Profile } from '../components/Profile';
import WagmiWallet from "../components/WagmiWallet";
import CustomButton from "../components/CustomButton";


function ProfilePage(){

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
        router.push('/signin');
    }
}, [session]);

  if (!session) {
      return <div>Loading...</div>; // or render a loading spinner
  }

  return (
    <>
    <WagmiWallet>
    <div>welcome: {session.username}</div>   

    <div> Connect your wallet and find art</div>

    <Profile/>
    <div>Profile Page</div>
    <CustomButton>Connect Wallet</CustomButton>

    </WagmiWallet>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  //console.log(session.email_address);

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default ProfilePage;