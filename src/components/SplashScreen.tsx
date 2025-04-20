"use client";
import "@/styles/splash.css"
import Image from "next/image";

export default function SplashScreen() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection:"column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        src={"/images/logo.png"}
        alt="logo"
        width={240}
        height={240}
      />
      <div className="loader"></div>
    </div>
  );
}
