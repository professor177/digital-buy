import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest { return { name:"Digital Buy", short_name:"Digital Buy", description:"Gaming accounts and digital subscriptions with protected order delivery.", start_url:"/", display:"standalone", background_color:"#090c12", theme_color:"#090c12", icons:[{src:"/icon.svg",sizes:"any",type:"image/svg+xml"}] }; }
