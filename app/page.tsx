"use client";
import ScrambleResolveText from "@/hooks/ScrambleResolveText";
import "@/styles/main_page.css";

export default function Layout() {
   
      const feedPaths = ["/feed/cognito.svg", "/feed/ec2.svg", 
        "/feed/nextjs.svg", "/feed/psql.svg", "/feed/lambda.svg",
        "/feed/route53.svg", "/feed/typescript.svg", "/feed/amplify.svg", "/feed/python.svg"
      ]

      return (

        <div className="w-screen h-[90vh] overflow-y-scroll scrollbar-hide bg-white">

          <div className="w-full h-full flex flex-col justify-center items-center px-5 gap-5">

                <div className="z-10 p-5 bg-gray-100/90 rounded-[30px]">
                    <ScrambleResolveText
                        text="goMeal"
                        speed={100}
                        step={0.5}
                        className="text-[75px] font-extralight tracking-widest"
                    />
                </div>

                <img
                  src="/gomeal.png"
                  className="w-30 h-30"
                />

                <div className="flex flex-col gap-5">
                  <h1 className="font-light font-sans text-sm tracking-widest leading-relaxed text-right p-5 bg-gray-100/50 rounded-xl">
                    goMeal is a <span className="rounded-[5px] bg-black text-white px-1">cooking-first platform</span> built for people who actually cook. Discover recipes, plan meals, and get live nutrition updates as you choose ingredients.
                    No ads. No noise. No creator drama.Just <span className="rounded-[5px] bg-black text-white px-1">tools for cooks</span>.
                  </h1>
                  <div className="flex space-x-7 bg-gray-100/90 rounded-lg py-1 justify-start md:justify-center overflow-x-auto scrollbar-hide">
                      {feedPaths.map((imgName, index) => {
                          return (
                              <img
                                  key={index}
                                  src={feedPaths[index]}
                                  className="w-10 h-10"
                              />
                          );
                      })}
                  </div>
                </div>
          </div>

        </div>
      )
}
