import { Navigate, Outlet } from "react-router-dom";
const quotes: string[] = [
  "Feel the adrenaline rush as you step onto the football pitch. Every match is a chance to make history.",
  "In the game of football, every pass, every tackle, every goal, is a moment that defines greatness.",
  "The roar of the crowd, the thrill of the game - football is more than just a sport, it's a way of life.",
  "On the football field, legends are born. Every player has the opportunity to write their own story.",
  "From grassroots to glory, the journey of football is one of passion, dedication, and endless possibilities.",
];
const generateQuote = (): string => {
  const quoteIndex = Math.round(Math.random() * 5) - 1;
  return quotes[quoteIndex];
};
const AuthLayout: React.FC = () => {
  const isAuthenticated = false;

  return (
    <>
      <div>
        {isAuthenticated ? (
          <Navigate to="/" />
        ) : (
          <div className="flex h-screen">
            <section className="relative w-1/2 md:block hidden">
              <img
                className="object-cover h-screen w-full"
                src="/assets/images/AuthBackground.jpg"
                alt="People playing football"
              />
              <div className="inset-0 absolute top-0 left-0 bg-gradient-to-b from-transparent from-80% to-slate-900 ">
                <h2 className=" absolute bottom-10 stroke-2 stroke-white bg-gradient-to-br from-slate-50 to-teal-600 bg-clip-text text-transparent h1-bold p-10 ">
                  {generateQuote()}
                </h2>
              </div>
            </section>
            <section className="w-full md:w-1/2">
              <Outlet />
            </section>
          </div>
        )}
      </div>
    </>
  );
};

export default AuthLayout;
