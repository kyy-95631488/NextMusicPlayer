import Link from "next/link";

const NavLink = ({ href, title }) => {
  const isHashLink = href.startsWith("#");

  const scrollToSection = (event) => {
    event.preventDefault();
    const sectionId = href.replace("#", "");
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (isHashLink) {
    return (
      <a
        href={href}
        onClick={scrollToSection}
        className="block py-2 pl-3 pr-4 text-[#ADB7BE] sm:text-xl rounded md:p-0 hover:text-white cursor-pointer"
      >
        {title}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="block py-2 pl-3 pr-4 text-[#ADB7BE] sm:text-xl rounded md:p-0 hover:text-white"
    >
      {title}
    </Link>
  );
};

export default NavLink;
