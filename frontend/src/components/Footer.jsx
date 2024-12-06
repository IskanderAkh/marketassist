import Container from "@/components/ui/Container";
import footer_logo from "@/assets/images/footer_logo.svg"
const Footer = () => {
  return (

    <footer className="footer text-neutral-content items-center p-4 mt-20">
      <Container>
        <div className="flex justify-between w-full items-center">
          <p className="footer-rights">2024 All rights reserved</p>
          <div>
            <img src={footer_logo} alt="" />
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
