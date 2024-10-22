import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from 'bootstrap';
import UsersRepository from '../../../../repositories/usersRepository';

interface SelectShopperProps {
  onShopperSelected: (data: { selection: { primaryInterest: string, ageRange: string }, assignedShopper: any }) => void;
}

const SelectShopper: React.FC<SelectShopperProps> = ({ onShopperSelected }) => {
  const [ageRange, setAgeRange] = useState('');
  const [primaryInterest, setPrimaryInterest] = useState('');
  const [shopperNotFound, setShopperNotFound] = useState(false);
  
  const categories = useSelector((state: any) => state.categories.categories);
  const formattedCategories = categories?.map((cat: any) => cat.name); // assuming formatted categories are needed

  const learnMoreRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const tooltip = new Tooltip(learnMoreRef.current!, { title: "This demo allows you to select a primary interest." });
    return () => tooltip.dispose();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await UsersRepository.getUnclaimed({ primaryInterest, ageRange });

    if (!data) {
      setShopperNotFound(true);
    } else {
      onShopperSelected({ selection: { primaryInterest, ageRange }, assignedShopper: data[0] });
    }
  };

  const resetShopperNotFound = () => setShopperNotFound(false);

  return (
    <div>
      <h1 className="heading">Select Shopper</h1>
      <p>Choose the shopper demographics</p>
      {shopperNotFound && (
        <div className="alert alert-warning" role="alert">
          Could not find a shopper matching the selected demographics. Please try again.
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="primaryInterest">Primary Interest</label>
          <select className="form-control" id="primaryInterest" onChange={e => setPrimaryInterest(e.target.value)}>
            <option value="">Select an interest</option>
            {formattedCategories?.map((category: string) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="ageRange">Age Range</label>
          <select className="form-control" id="ageRange" onChange={e => setAgeRange(e.target.value)}>
            <option value="">Select an age range</option>
            <option value="18-24">18-24</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45-54">45-54</option>
            <option value="55-69">55-69</option>
            <option value="70-and-above">70 and above</option>
          </select>
        </div>
        <button className="btn btn-primary" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SelectShopper;
