function CreatorCard(props){
  return (
    <div className="bg-white w- rounded-lg shadow-lg shadow-black mx-10 group-hover:shadow-2xl transition-all duration-500 hover:scale-110">
      <a href="#"><img src={props.image}/></a>
      <h1 className="flex justify-center m-2 font-bold text-[20px]">{props.name}</h1>
      <h3 className="p-3 tracking-wider">Subscrybers: {props.supporters}</h3>
      <h3 className="p-3 tracking-wider">Category: {props.category}</h3>
    </div>
  )
}

export default CreatorCard;