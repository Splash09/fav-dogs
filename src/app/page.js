'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dogData, setDogData] = useState([]);
  const cardsPerPage = 9;
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState(null);

  // Check if the user is logged in when the component mounts and route to login page
  useEffect(() => {
    setIsMounted(true);
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  // Fetch dog breeds and their images when the component mounts and map breeds to images
  useEffect(() => {
    if (isMounted) {
      const fetchBreeds = async () => {
        try {
          const res = await fetch('https://dog.ceo/api/breeds/list/all');
          if (!res.ok) {
            throw new Error('Failed to fetch breeds');
          }
          const data = await res.json();
          const breeds = Object.keys(data.message);

          const fetchImages = async (breed) => {
            const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
            if (!res.ok) {
              throw new Error(`Failed to fetch image for breed ${breed}`);
            }
            const data = await res.json();
            return data.message;
          };

          const breedImages = await Promise.all(
            breeds.map(async (breed) => ({
              breed,
              image: await fetchImages(breed),
            }))
          );

          setDogData(breedImages);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchBreeds();
    }
  }, [isMounted]);

  // Filter dog data based on the search term entered by the user
  const filteredData = dogData.filter((dog) =>
    dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate indices to handle pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredData.slice(indexOfFirstCard, indexOfLastCard);

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredData.length / cardsPerPage);

  // Function to handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="search-bar mb-4">
        <input
          type="text"
          id="search"
          placeholder="Search..."
          className="border p-2 w-full"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentCards.map((dog) => (
          <Card key={dog.breed} name={dog.breed} image={dog.image} />
        ))}
      </div>
      <div className="pagination mt-4 flex justify-center">
        <button
          className="px-4 py-2 bg-gray-300 rounded-md mr-2"
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          className="px-4 py-2 bg-gray-300 rounded-md mr-2"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-gray-300 rounded-md mr-2"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          className="px-4 py-2 bg-gray-300 rounded-md"
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default Home;