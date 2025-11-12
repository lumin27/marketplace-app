export default function SellingGuidePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] text-white flex flex-col items-center justify-center p-8'>
      <div className='max-w-3xl text-center'>
        <h1 className='text-3xl font-bold mb-4'>Selling Guide</h1>
        <p className='text-primary-foreground/80 mb-6 leading-relaxed'>
          Ready to sell your items? Follow these steps to create listings that
          stand out and attract buyers. Selling safely and effectively starts
          with a clear description and trust.
        </p>

        <ul className='text-left list-disc list-inside text-primary-foreground/90 space-y-3'>
          <li>
            <strong>Create a detailed listing</strong> — include high-quality
            photos, clear titles, and accurate descriptions.
          </li>
          <li>
            <strong>Set a fair price</strong> — research similar items to price
            competitively.
          </li>
          <li>
            <strong>Communicate clearly</strong> — respond to buyer messages
            quickly and politely.
          </li>
          <li>
            <strong>Meet safely</strong> — choose public locations for in-person
            transactions.
          </li>
          <li>
            <strong>Mark items as sold</strong> — once completed, update the
            listing to avoid confusion.
          </li>
        </ul>
      </div>
    </div>
  );
}
