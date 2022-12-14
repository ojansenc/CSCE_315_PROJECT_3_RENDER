import OrderMenuForm from './serverComponents/OrderMenu';

/**
 * @author Anthony Mercado
 * Manager page containing server tabs
 * @param {string} lang - The language the web page needs to be using
 * @param {string} mode - The theme mode for CSS styling
 * @returns Manager page
 */
const Server = ({ lang, mode }) => {
  return (
    <div className="Server">
      <OrderMenuForm lang={lang} mode = {mode} />
    </div>
  );
}

export default Server;