import Link from "next/link";
import logo from "../../../assets/logo.png";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="text-2xl text-primary shrink-0">
      <Image
        src={logo}
        alt="moms-promise Logo"
        className="max-w-20 md:max-w-22 absolute -top-0.5"
      />
    </Link>
  );
}
