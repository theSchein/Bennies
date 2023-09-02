import Link from "next/link";
import Search from "../components/Search";


export default function Home() {
  return (
    <>

    <h1>WAGMI</h1>
    <Link href="/signin"> 
    Login
    </Link>

    <div> Search</div>

    <Search/>

    
    </>
  );
}