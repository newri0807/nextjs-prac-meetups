// our-domain.com/
import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <>
      <Head>
        <title>Add a New Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active NextJs && React meetups! "
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

// *** 서버사이드 페이지 처리
// - 💥데이터가 자주 바뀌거나, 요청이 들어올때 마다 실행 될때 사용유용 💥
// *** //
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // fetch data from an API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   };
// }

// *** 정적 페이지 처리 *** //
/// revalidate: 1 <- 주기적으로 1초간 업데이트 설정
export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://newri0807:ArzhknAWdoZVw5Fi@nextjs-prac.ff0xbxe.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}
export default HomePage;
