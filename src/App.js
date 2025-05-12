import { useState } from "react";

//Main App Component
export default function App() {
  //intialising state to keep track of packing list
  const [items, setItems] = useState([]);

  //function to add a new item to the list
  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  // Function to delete an item based on its id
  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  // Function to toggle the 'packed' status of an item
  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  // Function to clear the entire list after user confirmation
  function handleClearList() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all your itmes?"
    );

    if (confirmed) setItems([]);
  }

  // Rendering the main application UI
  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItems={handleToggleItem}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

// Simple component to display app title
function Logo() {
  return <h1>🌴 Holiday List 💼</h1>;
}

// Form component to add new items
function Form({ onAddItems }) {
  // Local state for form inputs
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Handles form submission
  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    // Creating a new item object
    const newItem = { description, quantity, packed: false, id: Date.now() };

    // Passing new item to parent
    onAddItems(newItem);

    // Resetting form fields
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

// Component to display the list of items
function PackingList({ items, onDeleteItem, onToggleItems, onClearList }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  // Determine sorting method based on user selection
  if (sortBy === "input") sortedItems = items;

  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            onDeleteItem={onDeleteItem}
            onToggleItems={onToggleItems}
            key={item.id}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by Input Order</option>
          <option value="description">Sort by Description</option>
          <option value="packed">Sort by Packed Status</option>
        </select>
        <button onClick={onClearList}>Clear List</button>
      </div>
    </div>
  );
}

// Component to display an individual item
function Item({ item, onDeleteItem, onToggleItems }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggleItems(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity}
        {item.description}
        <button onClick={() => onDeleteItem(item.id)}>❌</button>
      </span>
    </li>
  );
}

// Stats component to show total and packed items
function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding some itmes to your packing list</em>
      </p>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "You are ready for your holiday✈️"
          : `You have ${numItems} items on your list and you already packed
        ${numPacked} (${percentage}%)`}
      </em>
    </footer>
  );
}
