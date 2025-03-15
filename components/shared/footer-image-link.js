import Image from 'next/image'


export default function FooterImageLink({ href, src, alt }) {

   return (
      <a href={href} className="inline-block m-0 p-0 pl-2 pr-2 leading-3">
         <Image src={src} alt={alt} width="18" height="18" />
      </a>
   )
}
