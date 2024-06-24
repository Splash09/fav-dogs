import Image from 'next/image';

const Card = ({ image, name }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={image} alt={name} width={400} height={300} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{name}</h2>
      </div>
    </div>
  );
};

export default Card;