import { useState, useEffect } from 'react';
import { fetchRooms } from '../services/RoomService';
import { Room } from '../types/Types'; // Import Room type

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]); // Ensure it's initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRooms = async () => {
      setLoading(true); // Start loading
      try {
        const data = await fetchRooms();
        console.log('Fetched Rooms:', data); // Log the fetched rooms
        if (Array.isArray(data)) {
          setRooms(data); // Set rooms data
        } else {
          throw new Error('Expected an array');
        }
      } catch (err) {
        console.error(err); // Log the error
        setError(error); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    getRooms();
  }, []);

  return { rooms, loading, error };
};
