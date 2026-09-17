import { GradientWave } from "@/components/ui/gradient-wave";

export default function Hero() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden bg-[#569ad6] px-6 py-24">
      <GradientWave
        colors={["#569ad6", "#7cc1ea", "#d9f2ff", "#78b9df", "#4b86c5", "#569ad6"]}
        noiseFrequency={[5, 7]}
        deform={{ noiseAmp: 250, noiseFlow: 5 }}
      />
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="max-w-3xl p-2">
          <h1 className="text-5xl font-bold tracking-tight text-[#1f1f1f] sm:text-6xl">
            Learn how stablecoins work.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#1f1f1f]">
            Explore demo wallets, simulated payments, and blockchain transactions with
            TetherLab’s safe, hands-on learning environment.
          </p>
          <a
            href="/create-demo-wallet"
            className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-base font-semibold text-[#1f1f1f] transition-colors hover:bg-white/90"
          >
            Create Demo Wallet
          </a>
        </div>
      </div>
    </section>
  );
}
