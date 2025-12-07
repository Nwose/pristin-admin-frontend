import Image from "next/image";

export default function PromoImage() {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-sm border border-gray-200 h-full relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/loginImage.png"
          alt="Fintech Dashboard"
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xl">▶️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
