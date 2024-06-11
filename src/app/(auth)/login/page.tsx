const page = () => {
  return (
    <div className="p-20">
      <h1 className="text-3xl text-center">Login</h1>
      <div>
        <form className="mt-10 flex flex-col items-center gap-8">
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="border-2 border-[#3497F9] p-3 rounded-xl"
              placeholder="example@email.com"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="border-2 border-[#3497F9] p-3 rounded-xl"
              placeholder="👻👻👻👻👻👻👻👻👻"
            />
          </div>
          <button className="bg-[#3497F9] p-3 w-4/6 text-white rounded-xl">Login</button>
        </form>
      </div>
      <div className="flex justify-center mt-5">
        <p>Don't have an account? <a href="/signup" className="text-[#3497F9]">Create One</a></p>
      </div>
    </div>
  );
};

export default page;
