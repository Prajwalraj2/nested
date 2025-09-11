// import { redirect } from "next/navigation";
import Link from "next/link";

export default function Home() {
  // redirect("/domain");
  return (
    <div className="p-4">


      <h1>Hello World</h1>
      <div className="flex flex-col gap-2">
      <p>Domain Page : <Link href="/domain" className="text-blue-500 underline">/domain</Link></p>

      <p>Graphic Designing Page : <Link href="/domain/gdesign" className="text-blue-500 underline">/domain/gdesign</Link></p>

      <div className="flex flex-col gap-2 ml-4">
        <p>Graphic Designing Youtube Channel : <Link href="/domain/gdesign/youtube-channel" className="text-blue-500 underline">/domain/gdesign/youtube-channel</Link></p>
        <p>Graphic Designing Courses : <Link href="/domain/gdesign/courses" className="text-blue-500 underline">/domain/gdesign/courses</Link></p>
        <p>Graphic Designing Client Questionaries | Invoice | Contract : <Link href="/domain/gdesign/client-management" className="text-blue-500 underline">/domain/gdesign/client-management</Link></p>
           <div className="flex flex-col gap-2 ml-4">
            <p>Graphic Designing Client Questionaries  : <Link href="domain/gdesign/client-management/client-questionnaire" className="text-blue-500 underline">domain/gdesign/client-management/client-questionnaire</Link></p>
            <p>Graphic Designing Invoice  : <Link href="domain/gdesign/client-management/invoice" className="text-blue-500 underline">domain/gdesign/client-management/invoice</Link></p>
            <p>Graphic Designing Contract  : <Link href="domain/gdesign/client-management/contracts" className="text-blue-500 underline">domain/gdesign/client-management/contract</Link></p>
           </div>
      </div>

      <p>Web Development Page : <Link href="/domain/webdev" className="text-blue-500 underline">/domain/webdev</Link></p>

      <div className="flex flex-col gap-2 ml-4">
        <p>Web Development with-code : <Link href="/domain/webdev/with-code" className="text-blue-500 underline">/domain/webdev/with-code</Link></p>
          <div className="flex flex-col gap-2 ml-4">
            <p>Web Development with-code Youtube Channel : <Link href="/domain/webdev/with-code/youtube-channel" className="text-blue-500 underline">/domain/webdev/with-code/youtube-channel</Link></p>
            <p>Web Development with-code Courses : <Link href="/domain/webdev/with-code/courses" className="text-blue-500 underline">/domain/webdev/with-code/courses</Link></p>
            <p>Web Development with-code Client Questionaries  : <Link href="/domain/webdev/with-code/client-management" className="text-blue-500 underline">/domain/webdev/with-code/client-management</Link></p>
          </div>
        <p>Web Development no-code : <Link href="/domain/webdev/no-code" className="text-blue-500 underline">/domain/webdev/no-code</Link></p>

        <div className="flex flex-col gap-2 ml-4">
          <p>Web Development no-code Youtube Channel : <Link href="/domain/webdev/no-code/youtube-channel" className="text-blue-500 underline">/domain/webdev/no-code/youtube-channel</Link></p>
          <p>Web Development no-code Courses : <Link href="/domain/webdev/no-code/courses" className="text-blue-500 underline">/domain/webdev/no-code/courses</Link></p>
          <p>Web Development no-code Client Questionaries  : <Link href="/domain/webdev/no-code/client-management" className="text-blue-500 underline">/domain/webdev/no-code/client-management</Link></p>
        </div>

      </div>

      <p>App Development Page : <Link href="/domain/appdev" className="text-blue-500 underline">/domain/appdev</Link></p>

      <p>Admin Page : <Link href="/admin" className="text-blue-500 underline">/admin</Link></p>
      <p>Admin Categories Page : <Link href="/admin/categories" className="text-blue-500 underline">/admin/categories</Link></p>
      <p>Admin Domains Page : <Link href="/admin/domains" className="text-blue-500 underline">/admin/domains</Link></p>
      <p>Admin Pages Page : <Link href="/admin/pages" className="text-blue-500 underline">/admin/pages</Link></p>


    </div>
    </div>
  );
}
