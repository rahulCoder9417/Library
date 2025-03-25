
interface Props {
  number: number;
}

interface Props1 {
  number: number;
  title: string; // ✅ Fixed type to lowercase string
  totalNumber: number;
}

const GrowthChecker = ({ number }: Props) => {
  if (number > 0) {
    return (
      <span className="text-green-600  flex flex-row">
       
        <svg width="19"className="mt-1 " height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.812 11.4651C15.7695 11.5679 15.6974 11.6558 15.6049 11.7176C15.5124 11.7794 15.4037 11.8124 15.2924 11.8125H4.04244C3.93112 11.8125 3.82228 11.7796 3.7297 11.7178C3.63711 11.656 3.56495 11.5681 3.52233 11.4653C3.47972 11.3624 3.46858 11.2493 3.49032 11.1401C3.51207 11.0309 3.56571 10.9307 3.64447 10.852L9.26947 5.22699C9.32171 5.17469 9.38375 5.1332 9.45203 5.10489C9.52032 5.07658 9.59351 5.06201 9.66744 5.06201C9.74136 5.06201 9.81455 5.07658 9.88284 5.10489C9.95113 5.1332 10.0132 5.17469 10.0654 5.22699L15.6904 10.852C15.769 10.9307 15.8226 11.031 15.8442 11.1401C15.8659 11.2492 15.8547 11.3623 15.812 11.4651Z" fill="#2CC171"/>
</svg>

        {number}
      </span>
    );
  } else if (number < 0) {
    return (
      <span className="text-red-600  flex flex-row">

        <svg width="18" className="mt-1 " height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.1451 6.53489C15.1025 6.4321 15.0304 6.34423 14.9379 6.28241C14.8454 6.22058 14.7367 6.18757 14.6254 6.18755H3.37544C3.26413 6.18746 3.15529 6.2204 3.0627 6.2822C2.97012 6.34401 2.89795 6.43189 2.85534 6.53473C2.81273 6.63756 2.80159 6.75073 2.82333 6.85991C2.84507 6.96908 2.89872 7.06935 2.97747 7.14801L8.60247 12.773C8.65472 12.8253 8.71675 12.8668 8.78504 12.8951C8.85333 12.9234 8.92652 12.938 9.00044 12.938C9.07437 12.938 9.14756 12.9234 9.21585 12.8951C9.28413 12.8668 9.34617 12.8253 9.39841 12.773L15.0234 7.14801C15.1021 7.0693 15.1556 6.96904 15.1772 6.8599C15.1989 6.75077 15.1877 6.63766 15.1451 6.53489Z" fill="#E27233"/>
</svg>

        {number}
      </span>
    );
  } else {
    return (
      <span className="text-black font-medium">
        0
      </span>
    );
  }
};

const NewWeekAnalytics = ({ title, number, totalNumber }: Props1) => {
  return (
    <div className="bg-white rounded-lg flex flex-col gap-10 max-md:gap-5 p-4 flex-1">
      <section className="flex items-center justify-between">
        <p className="text-lg text-slate-600 max-md:text-xs">
          {title}
        </p>
        <GrowthChecker number={number} />
      </section>
      <h1 className="text-3xl max-md:text-xl font-semibold">
        {totalNumber}
      </h1>
    </div>
  );
};

export default NewWeekAnalytics;
