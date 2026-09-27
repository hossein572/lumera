"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { addDays, faDec, faNum, jDateLong, relativeDay, toISO } from "@/lib/fa";
import { serviceById } from "@/data/services";
import { reviewsFor, ratingSummary } from "@/data/reviews";
import type { Review } from "@/data/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, Chip } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { BottomSheet } from "@/components/ui/Overlay";
import { EmptyState } from "@/components/ui/EmptyState";
import { Rating, RatingBars } from "@/components/ui/Rating";
import {
  IconCheckCircle,
  IconMessage,
  IconQuote,
  IconSparkle,
  IconStar,
} from "@/components/icons";
import { useLumera } from "@/store/useLumera";

export function ReviewsBlock({
  specialistId,
  specialistName,
  tint,
  categoryId,
}: {
  specialistId: string;
  specialistName: string;
  tint: "violet" | "mint" | "rose" | "amber";
  categoryId: "skin" | "hair" | "nails" | "makeup" | "care" | "massage";
}) {
  const base = useMemo(() => reviewsFor(specialistId), [specialistId]);
  const summary = useMemo(() => ratingSummary(specialistId), [specialistId]);
  const [local, setLocal] = useState<Review[]>([]);
  const [onlyVerified, setOnlyVerified] = useState(true);
  const [sort, setSort] = useState<"recent" | "helpful" | "high">("recent");
  const [sheet, setSheet] = useState(false);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [helpful, setHelpful] = useState<Record<string, boolean>>({});
  const push = useLumera((s) => s.pushToast);
  const profile = useLumera((s) => s.profile);

  const all = useMemo(() => [...local, ...base], [local, base]);
  const list = useMemo(() => {
    const filtered = onlyVerified ? all.filter((r) => r.verifiedVisit) : all;
    const sorted = [...filtered];
    if (sort === "helpful")
      sorted.sort(
        (a, b) =>
          b.likeCount +
          (helpful[b.id] ? 1 : 0) -
          (a.likeCount + (helpful[a.id] ? 1 : 0)),
      );
    if (sort === "high") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [all, onlyVerified, sort, helpful]);

  function submit() {
    if (text.trim().length < 12) {
      push({ text: "متن نظر باید حداقل ۱۲ حرف باشد.", tone: "warn" });
      return;
    }
    const review: Review = {
      id: `rv-local-${Date.now()}`,
      specialistId,
      author: profile.name || "شما",
      rating: stars,
      date: toISO(new Date()),
      text: text.trim(),
      serviceId: base[0]?.serviceId ?? "",
      likeCount: 0,
      verifiedVisit: true,
      reply: undefined,
    };
    setLocal((l) => [review, ...l]);
    setSheet(false);
    setText("");
    setStars(5);
    push({
      text: "نظر شما ثبت شد و پس از بررسی منتشر می‌شود.",
      tone: "success",
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* جمع‌بندی امتیاز */}
      <div className="lg:sticky lg:top-[140px] lg:self-start">
        <div className="rounded-lg border border-line bg-surface p-4">
          <div className="flex items-end gap-3">
            <span className="text-[36px] font-extrabold leading-none tracking-tight">
              {faDec(summary.average)}
            </span>
            <span className="pb-1">
              <Rating value={summary.average} size="lg" showValue={false} />
              <span className="mt-1 block text-[11.5px] text-faint">
                {faNum(summary.total)} نظر
              </span>
            </span>
          </div>
          <div className="mt-4">
            <RatingBars
              buckets={summary.buckets}
              total={summary.total}
              average={summary.average}
            />
          </div>
          <div className="mt-4 space-y-2 border-t border-line-soft pt-3.5 text-[12px] text-muted">
            <p className="flex items-center gap-1.5">
              <IconCheckCircle size={13} className="text-mint" />
              {faNum(summary.recommend)}٪ دوباره رزرو می‌کنند
            </p>
            <p className="flex items-center gap-1.5">
              <IconSparkle size={13} className="text-accent" />
              {faNum(summary.withPhoto)} نظر با نمونه‌کار
            </p>
          </div>
          <Button block className="mt-4" onClick={() => setSheet(true)}>
            ثبت نظر
          </Button>
          <p className="mt-2 text-[11px] leading-relaxed text-faint">
            نظر فقط برای کاربرانی فعال است که رزرو «انجام شده» دارند.
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <div className="mb-3.5 flex flex-wrap items-center gap-2">
          <Chip
            active={onlyVerified}
            onClick={() => setOnlyVerified((v) => !v)}
          >
            فقط تأییدشده
          </Chip>
          <span className="h-5 w-px bg-line" aria-hidden />
          {(
            [
              { v: "recent", l: "جدیدترین" },
              { v: "helpful", l: "مفیدترین" },
              { v: "high", l: "بیشترین امتیاز" },
            ] as const
          ).map((o) => (
            <Chip key={o.v} active={sort === o.v} onClick={() => setSort(o.v)}>
              {o.l}
            </Chip>
          ))}
          <span className="ms-auto text-[11.5px] text-faint">
            {faNum(list.length)} نمایش داده‌شده
          </span>
        </div>

        {list.length ? (
          <ul className="space-y-3">
            {list.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-line bg-surface p-3.5 sm:p-4"
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    name={r.author}
                    size="sm"
                    tint={tint}
                    category={categoryId}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[13.5px] font-bold">
                        {r.author}
                      </span>
                      {r.verifiedVisit ? (
                        <Badge tone="mint">رزرو تأییدشده</Badge>
                      ) : (
                        <Badge tone="neutral">بدون رزرو</Badge>
                      )}
                      {r.id.startsWith("rv-local") ? (
                        <Badge tone="violet">نظر شما</Badge>
                      ) : null}
                      <span className="ms-auto text-[11px] text-faint">
                        {jDateLong(r.date)}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Rating value={r.rating} size="sm" showValue={false} />
                      <span className="text-[11.5px] text-faint">
                        {serviceById[r.serviceId]?.name ?? "خدمت"}
                      </span>
                      <span className="text-[11.5px] text-faint">
                        · {relativeDay(r.date)}
                      </span>
                    </div>
                    <p className="mt-2.5 text-[13px] leading-[1.95] text-muted">
                      «{r.text}»
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-line-soft pt-2.5 text-[11.5px]">
                      <button
                        type="button"
                        onClick={() =>
                          setHelpful((h) => ({ ...h, [r.id]: !h[r.id] }))
                        }
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-xs border px-2 py-1 font-semibold transition-colors",
                          helpful[r.id]
                            ? "border-mint/45 bg-mint/10 text-mint"
                            : "border-line text-faint hover:text-ink",
                        )}
                      >
                        <IconSparkle size={11} />
                        مفید بود
                        <span className="tabular-nums">
                          {faNum(r.likeCount + (helpful[r.id] ? 1 : 0))}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSheet(true);
                          push({
                            text: "برای پاسخ‌دادن، نظر جدید را ثبت کنید (پاسخ خصوصی در نسخه نمایشی فعال نیست).",
                            tone: "neutral",
                          });
                        }}
                        className="inline-flex items-center gap-1.5 text-faint transition-colors hover:text-ink"
                      >
                        <IconMessage size={12} />
                        پاسخ
                      </button>
                    </div>

                    {r.reply ? (
                      <div className="mt-3 rounded-md border-s-2 border-accent/45 bg-surface-2/50 px-3 py-2.5">
                        <p className="flex items-center gap-1.5 text-[11.5px] font-bold text-accent">
                          <IconQuote size={12} />
                          پاسخ {specialistName}
                        </p>
                        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                          {r.reply}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            compact
            tint="mint"
            icon={<IconStar size={17} />}
            title="هنوز نظری با این فیلترها نیست"
            body="فیلتر «فقط تأییدشده» را بردارید تا نظرهای بدون رزرو تأییدشده هم دیده شوند."
            action={{
              label: "نمایش همه‌ی نظرها",
              onClick: () => setOnlyVerified(false),
            }}
          />
        )}
      </div>

      <BottomSheet
        open={sheet}
        onClose={() => setSheet(false)}
        title="ثبت نظر"
        description={`${specialistName} — تجربه‌ی خود را بنویسید`}
        footer={
          <Button block onClick={submit}>
            انتشار نظر
          </Button>
        }
      >
        <div className="space-y-4">
          <div>
            <span className="label mb-2 block text-muted">امتیاز شما</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${faNum(n)} ستاره`}
                    onClick={() => setStars(n)}
                    className={cn(
                      "grid h-11 w-11 place-items-center rounded-md border transition-colors",
                      n <= stars
                        ? "border-amber/50 bg-amber/10 text-amber"
                        : "border-line text-faint hover:text-muted",
                    )}
                  >
                    <IconStar size={20} fill={n <= stars ? "full" : "none"} />
                  </button>
                ))}
              </div>
              <span className="text-[13px] font-bold tabular-nums text-muted">
                {faNum(stars)}.0
              </span>
            </div>
          </div>
          <Textarea
            label="تجربه‌ی شما"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 400))}
            counter={`${faNum(text.length)} / ۴۰۰`}
            placeholder="درباره‌ی تمیزی کار، وقت‌شناسی، نتیجه و برخورد تیم بنویسید. نظرهای دقیق‌تر به بقیه کمک می‌کند."
          />
          <div className="flex items-start gap-2 rounded-md bg-surface-2/60 px-3 py-2.5 text-[11.5px] leading-relaxed text-muted">
            <IconCheckCircle
              size={13}
              className="mt-[2px] shrink-0 text-mint"
            />
            نظر شما با برچسب «رزرو تأییدشده» منتشر می‌شود، چون رزرو انجام‌شده‌ی{" "}
            {faNum(1)} جلسه‌ی «پاکسازی تخصصی پوست» دارید.
          </div>
          <p className="text-[11px] text-faint">
            آخرین بازدید شما: {jDateLong(addDays(toISO(new Date()), -18))}
          </p>
        </div>
      </BottomSheet>
    </div>
  );
}
