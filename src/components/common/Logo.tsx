interface LogoProps {
  height?: number;
  blanco?: boolean;
}

const logoColor = new URL(
  "../../assets/Logo-Petcare-web.svg",
  import.meta.url
).href;

const logoBlanco = new URL(
  "../../assets/Logo-Petcare-web-1.svg",
  import.meta.url
).href;

export default function Logo({ height = 36, blanco = false }: LogoProps) {
  return (
    <img
      src={blanco ? logoBlanco : logoColor}
      alt="Petcare"
      style={{ height }}
    />
  );
}