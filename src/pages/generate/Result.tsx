"use client";
import Image from "next/image";

type ResultProps = {
  imgSrc: string;
};
export default function Result({ imgSrc }: ResultProps) {
  if (imgSrc === "") {
    return <></>;
  }
  return (
    <>
      <img src={imgSrc} alt="result"></img>
    </>
  );
}
