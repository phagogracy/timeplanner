/* eslint-disable @next/next/no-img-element */

export default function AuthLayout({
  children,
  backgroundImage,
}: {
  children?: React.ReactNode;
  backgroundImage?: string;
}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-blueWhite">
      <div className="w-full max-w-5xl bg-white min-h-screen sm:min-h-[600px] max-h-fit mx-0 sm:mx-8 my-0 sm:my-8 grid grid-rows-4 md:grid-rows-none md:grid-cols-3">
        <div className="bg-slate-900 flex row-span-1 md:col-span-1 md:row-auto relative">
          {backgroundImage != null ? (
            <img
              src={backgroundImage}
              alt="time_planner_background"
              className="absolute w-full h-full object-cover"
            />
          ) : (
            <></>
          )}
        </div>
        <div className="row-span-3 md:row-auto md:col-span-2 flex justify-center w-full items-start sm:items-center p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
