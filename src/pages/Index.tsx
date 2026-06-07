import { useState } from "react";
import Icon from "@/components/ui/icon";

type FormState = "idle" | "loading" | "success" | "error";

export default function Index() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [formState, setFormState] = useState<FormState>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");

    try {
      const res = await fetch("https://functions.poehali.dev/8b0d1b88-57f5-4e5d-b703-b3fe50a7df37", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormState("success");
        setFormData({ name: "", phone: "", message: "" });
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  return (
    <div className="min-h-screen font-body bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[100px]" />
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
        <div className="hidden sm:flex items-center gap-2 text-sm text-white/40">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Онлайн
        </div>
      </header>

      {/* Главный контент */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-16 max-w-2xl mx-auto">
        {/* Бейдж */}
        <div
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium animate-fade-in"
        >
          <Icon name="Sparkles" size={14} />
          Быстрый отклик в течение часа
        </div>

        {/* Заголовок */}
        <h1
          className="font-display text-5xl sm:text-7xl font-bold text-center leading-none mb-4 tracking-tight"
          style={{ animation: "fade-in 0.6s ease-out 0.1s forwards", opacity: 0 }}
        >
          <span className="text-white">ОСТАВЬТЕ</span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            ЗАЯВКУ
          </span>
        </h1>

        <p
          className="text-white/50 text-center text-base sm:text-lg mb-12 max-w-md leading-relaxed"
          style={{ animation: "fade-in 0.6s ease-out 0.2s forwards", opacity: 0 }}
        >
          Заполните форму — мы получим уведомление и свяжемся с вами в ближайшее время
        </p>

        {/* Форма */}
        {formState !== "success" ? (
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-4"
            style={{ animation: "fade-in 0.6s ease-out 0.3s forwards", opacity: 0 }}
          >
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors">
                <Icon name="User" size={18} />
              </div>
              <input
                type="text"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 pl-12 text-white placeholder-white/30 outline-none transition-all focus:border-violet-500/60 focus:bg-white/[0.08] focus:shadow-[0_0_0_1px_rgba(139,92,246,0.3)]"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors">
                <Icon name="Phone" size={18} />
              </div>
              <input
                type="tel"
                placeholder="Номер телефона"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 pl-12 text-white placeholder-white/30 outline-none transition-all focus:border-violet-500/60 focus:bg-white/[0.08] focus:shadow-[0_0_0_1px_rgba(139,92,246,0.3)]"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-4 text-white/30 group-focus-within:text-violet-400 transition-colors">
                <Icon name="MessageSquare" size={18} />
              </div>
              <textarea
                placeholder="Сообщение (опционально)"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 pl-12 text-white placeholder-white/30 outline-none transition-all focus:border-violet-500/60 focus:bg-white/[0.08] focus:shadow-[0_0_0_1px_rgba(139,92,246,0.3)] resize-none"
              />
            </div>

            {formState === "error" && (
              <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                <Icon name="AlertCircle" size={16} />
                Не удалось отправить заявку. Попробуйте ещё раз.
              </div>
            )}

            <button
              type="submit"
              disabled={formState === "loading"}
              className="w-full relative overflow-hidden rounded-2xl py-4 px-6 font-display text-lg font-semibold tracking-wide text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #0891b2 100%)",
              }}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-2xl" />
              <span className="relative flex items-center justify-center gap-2">
                {formState === "loading" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Отправляем...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={18} />
                    Отправить заявку
                  </>
                )}
              </span>
            </button>

            <p className="text-center text-white/25 text-xs">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
            </p>
          </form>
        ) : (
          <div
            className="w-full text-center space-y-6 animate-fade-in"
          >
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-[0_0_60px_rgba(52,211,153,0.4)]">
                <Icon name="CheckCircle" size={40} className="text-white" />
              </div>
            </div>

            <div>
              <h2 className="font-display text-4xl font-bold text-white mb-2">ГОТОВО!</h2>
              <p className="text-white/50 text-lg">
                Заявка отправлена. Мы получили уведомление и скоро свяжемся с вами.
              </p>
            </div>

            <button
              onClick={() => setFormState("idle")}
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors text-sm font-medium"
            >
              <Icon name="ArrowLeft" size={16} />
              Отправить ещё одну заявку
            </button>
          </div>
        )}

        {/* Фичи */}
        <div
          className="mt-16 grid grid-cols-3 gap-4 w-full"
          style={{ animation: "fade-in 0.6s ease-out 0.5s forwards", opacity: 0 }}
        >
          {[
            { icon: "Clock", label: "Ответ за 1 час" },
            { icon: "Shield", label: "Данные защищены" },
            { icon: "Zap", label: "Мгновенное уведомление" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center"
            >
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Icon name={item.icon as Parameters<typeof Icon>[0]["name"]} size={16} className="text-violet-400" />
              </div>
              <span className="text-white/50 text-xs leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}