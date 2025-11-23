export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-red-500">
        🎯 Test Page - Wenn du das siehst, funktioniert Next.js!
      </h1>
      <p className="mt-4 text-lg">
        URL: http://localhost:3000/test
      </p>
      <div className="mt-4 p-4 bg-blue-100 rounded">
        Tailwind CSS Test - dieser Block sollte blau sein
      </div>
    </div>
  )
}