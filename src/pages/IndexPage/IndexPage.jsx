import FavoritePlaces from "../../components/FavoritePlaces/FavoritePlaces";
import Map from "../../components/Map/Map";
import './IndexPage.css'


export default function IndexPage() {
  return (
    <div className="index-container">
      <h1>Need Help Deciding Where to Go?</h1>
      <h2>Here Are Some of Our Favorite Places in the World</h2>
      <FavoritePlaces />
    </div>
  );
}


