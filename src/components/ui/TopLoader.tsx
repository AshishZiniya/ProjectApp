import NextTopLoader from "nextjs-toploader";

const TopLoader: React.FC = () => {
  return (
    <NextTopLoader
      color="#2299DD" // You can customize the color
      initialPosition={0.08}
      crawlSpeed={300} // Increased speed
      height={4} // Increased height
      crawl={true}
      showSpinner={false}
      easing="easeinout"
      speed={300} // Increased speed
      shadow="0 0 10px #2299DD,0 0 5px #2299DD"
    />
  );
};

export default TopLoader;
