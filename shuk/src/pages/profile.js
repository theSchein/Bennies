import { getSession, useSession } from 'next-auth/react';


function ProfilePage(){

  const { data: session } = useSession();

  if (!session) {
      return <div>Loading...</div>; // or render a loading spinner
  }

  return (
    <>
    <div>Profile Page</div>
    <div>welcome: {session.username}</div>   
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