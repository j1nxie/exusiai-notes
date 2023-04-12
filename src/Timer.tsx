import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import type { Duration } from "luxon";
import "./Timer.css";

type MissionDictionary = Record<string, Array<string>>;

const allMissions = [
	"Cargo Escort",
	"Tactical Drill",
	"Resource Search",
	"Tough Siege",
	"Aerial Threat",
	"Solid Defense",
	"Fierce Attack",
	"Unstoppable Charge",
	"Fearless Protection",
];

const missions: MissionDictionary = {
	Monday: ["Tactical Drill", "Resource Search", "Tough Siege", "Solid Defense", "Fierce Attack"],
	Tuesday: [
		"Tactical Drill",
		"Cargo Escort",
		"Aerial Threat",
		"Fierce Attack",
		"Fearless Protection",
	],
	Wednesday: [
		"Tactical Drill",
		"Resource Search",
		"Aerial Threat",
		"Unstoppable Charge",
		"Fearless Protection",
	],
	Thursday: [
		"Tactical Drill",
		"Cargo Escort",
		"Tough Siege",
		"Solid Defense",
		"Unstoppable Charge",
	],
	Friday: [
		"Tactical Drill",
		"Resource Search",
		"Aerial Threat",
		"Solid Defense",
		"Fierce Attack",
	],
	Saturday: [
		"Tactical Drill",
		"Cargo Escort",
		"Resource Search",
		"Tough Siege",
		"Fierce Attack",
		"Unstoppable Charge",
		"Fearless Protection",
	],
	Sunday: [
		"Tactical Drill",
		"Cargo Escort",
		"Tough Siege",
		"Aerial Threat",
		"Unstoppable Charge",
		"Fearless Protection",
	],
};

function getTime(): [DateTime, DateTime, Duration] {
	const localDt = DateTime.now();
	const serverDt = DateTime.utc().setZone("UTC-7");
	let resetTime = DateTime.fromFormat("04:00", "HH:mm", { zone: "UTC-7" });

	if (resetTime < serverDt) {
		resetTime = resetTime.plus({ day: 1 });
	}

	let diff = resetTime.diff(serverDt, ["hours", "minutes", "seconds"]);

	if (resetTime < serverDt) {
		diff = diff.plus({ hours: 24 });
	}

	return [localDt, serverDt, diff];
}

function Timer() {
	let [localDt, serverDt, diff] = getTime();
	const [localDate, setLocalDate] = useState(localDt.toFormat("DDD TTT"));
	const [serverDate, setServerDate] = useState(serverDt.toFormat("DDD TTT"));
	// TODO: render singular hour and minutes
	const [resetPeriod, setResetPeriod] = useState(`${diff.hours} hours, ${diff.minutes} minutes`);
	// NOTE: ugly hack because the game resets at 04:00 UTC-7, offsetting by
	// another 4 hours to make it correct :tehe:
	const [weekday, setWeekday] = useState(DateTime.utc().setZone("UTC-11").weekdayLong);

	useEffect(() => {
		const interval = setInterval(() => {
			[localDt, serverDt, diff] = getTime();
			setLocalDate(localDt.toFormat("DDD TTT"));
			setServerDate(serverDt.toFormat("DDD TTT"));
			setResetPeriod(`${diff.hours} hours, ${diff.minutes} minutes`);

			const weekday = serverDt.setZone("UTC-11").weekdayLong;

			setWeekday(weekday);
		});

		return () => {
			clearInterval(interval);
		};
	});

	return (
		<div className="Timer">
			<div className="container">
				<div className="cards">
					<div className="card timers">
						<div className="time-left">
							<section>
								<h3>Server Reset Time</h3>
								<span>04:00 UTC-7</span>
							</section>
							<section>
								<h3>Time Until Reset</h3>
								<span>{resetPeriod}</span>
							</section>
						</div>
						<div className="time-right">
							<section>
								<h3>Local Time</h3>
								<span>{localDate}</span>
							</section>
							<section>
								<h3>Server Time</h3>
								<span>{serverDate}</span>
							</section>
						</div>
					</div>
					<div className="card weekday">
						<div className="time">
							<section>
								<h3>Current Weekday</h3>
								<span>{weekday}</span>
							</section>
						</div>
					</div>
				</div>
				<div className="missions">
					{allMissions.map((mission) => (
						<div
							className={
								missions[weekday].includes(mission)
									? "time mission-card"
									: "time mission-card unselected"
							}
						>
							{mission}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Timer;
