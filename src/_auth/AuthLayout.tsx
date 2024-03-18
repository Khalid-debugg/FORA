import { Navigate, Outlet } from "react-router-dom";
const quotes: string[] = [
  "Dive into the football frenzy. Hunt down matches nearby, teamup, and own the pitch!",
  "Dive into the football fervor. Hunt down nearby matches, unite, and claim the pitch!",
  "Immerse yourself in the football frenzy. Explore nearby matches, team up, and dominate the field!",
  "Plunge into the football passion. Discover nearby matches, join forces, and seize the pitch!",
  "Indulge in the football frenzy. Uncover nearby matches, collaborate, and conquer the field!",
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
