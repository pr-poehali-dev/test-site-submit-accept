import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const GET_TARIFF_URL = "https://functions.poehali.dev/cc379834-4f4e-44f7-a277-83138278898f";

type TariffStatus = "idle" | "loading" | "done" | "error";

interface TariffResult {
  tariff: string;
  active: boolean;
  expires_at?: string;
}

const plans = [
  {
    id: "free",
    name: "Бесплатный",
    price: "0 ₽",
    period: "навсегда",
    color: "#6b7280",
    gradient: "from-gray-500/20 to-gray-600/10",
    border: "border-white/10",
    features: ["1 проект", "Базовые функции", "Email поддержка"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "990 ₽",
    period: "в месяц",
    color: "#8b5cf6",
    gradient: "from-violet-500/30 to-pink-500/20",
    border: "border-violet-500/40",
    features: ["Безлимитные проекты", "Приоритетная поддержка", "Расширенная аналитика", "API доступ"],
    popular: true,
  },
  {
    id: "business",
    name: "Бизнес",
    price: "4 990 ₽",
    period: "в месяц",
    color: "#f59e0b",
    gradient: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/30",
    features: ["Всё из Premium", "Выделенный сервер", "SLA 99.9%", "Персональный менеджер"],
  },
];

export default function Tariffs() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<TariffStatus>("idle");
  const [result, setResult] = useState<TariffResult | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
      fetchTariff(emailFromUrl);
    }
  }, []);

  const fetchTariff = async (emailVal: string) => {
    setStatus("loading");
    try {
      const res = await fetch(`${GET_TARIFF_URL}?email=${encodeURIComponent(emailVal)}`);
      const data = await res.json();
      setResult(data);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const checkTariff = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchTariff(email);
  };

  const activePlan = status === "done" && result ? result.tariff : null;

  return (
    <div className="min-h-screen font-body bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Фон */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/15 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Шапка */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Icon name="Zap" size={16} className="text-white" />
          </div>
          <span className="font-display text-lg font-semibold tracking-wide text-white/90">ЗАЯВКИ</span>
        </div>
        <a
          href="/"
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад
        </a>
      </header>

      <main className="relative z-10 px-4 py-12 max-w-5xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium">
            <Icon name="Crown" size={14} />
            Выберите свой план
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold leading-none tracking-tight mb-4">
            <span className="text-white">ТАРИФЫ</span>
          </h1>
          <p className="text-white/50 text-lg max-w-md mx-auto">
            Введите email, чтобы увидеть ваш текущий тариф
          </p>
        </div>

        {/* Форма проверки */}
        <form onSubmit={checkTariff} className="flex gap-3 max-w-md mx-auto mb-14 animate-fade-in">
          <div className="relative flex-1 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors">
              <Icon name="Mail" size={18} />
            </div>
            <input
              type="email"
              placeholder="Ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 pl-12 text-white placeholder-white/30 outline-none transition-all focus:border-violet-500/60 focus:bg-white/[0.08] focus:shadow-[0_0_0_1px_rgba(139,92,246,0.3)]"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-5 py-3 rounded-2xl font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
          >
            {status === "loading" ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Icon name="Search" size={18} />
            )}
          </button>
        </form>

        {/* Статус тарифа */}
        {status === "done" && result && (
          <div
            className="max-w-md mx-auto mb-10 animate-fade-in"
          >
            {result.active ? (
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Icon name="CheckCircle" size={18} />
                </div>
                <div>
                  <div className="font-semibold">Premium активен</div>
                  <div className="text-sm text-emerald-400/70">Действует до {result.expires_at}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/50">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Icon name="Info" size={18} />
                </div>
                <div>
                  <div className="font-semibold text-white/70">Активный тариф не найден</div>
                  <div className="text-sm">Оставьте заявку, чтобы получить Premium</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Карточки тарифов */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const isCurrent = activePlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl border p-6 flex flex-col transition-all duration-300 ${plan.border} bg-gradient-to-br ${plan.gradient} ${isCurrent ? "ring-2 scale-[1.02]" : ""}`}
                style={{
                  animation: `fade-in 0.6s ease-out ${i * 0.1}s forwards`,
                  opacity: 0,
                  ...(isCurrent ? { ringColor: plan.color } : {}),
                }}
              >
                {/* Бейджи */}
                {plan.popular && !isCurrent && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: plan.color }}
                  >
                    Популярный
                  </div>
                )}
                {isCurrent && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
                    style={{ background: plan.color }}
                  >
                    <Icon name="CheckCircle" size={12} />
                    Текущий
                  </div>
                )}

                {/* Название */}
                <div className="mb-4">
                  <h3 className="font-display text-xl font-bold text-white">{plan.name}</h3>
                </div>

                {/* Цена */}
                <div className="mb-6">
                  <span className="font-display text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/40 text-sm ml-2">{plan.period}</span>
                </div>

                {/* Фичи */}
                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-white/70 text-sm">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: plan.color + "33" }}
                      >
                        <Icon name="Check" size={10} className="text-white" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Кнопка */}
                {isCurrent ? (
                  <div
                    className="w-full py-3 rounded-2xl text-center text-sm font-semibold text-white"
                    style={{ background: plan.color + "33", border: `1px solid ${plan.color}66` }}
                  >
                    ✓ Активен
                  </div>
                ) : (
                  <a
                    href="/"
                    className="w-full py-3 rounded-2xl text-center text-sm font-semibold text-white/60 border border-white/10 hover:bg-white/5 transition-colors block"
                  >
                    Оставить заявку
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}