export default function Cards({ title, value, icon }) {
  return (
    <div className="card flex-1 flex flex-row gap-5 items-center">
      {icon}

      <div className="">
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}
