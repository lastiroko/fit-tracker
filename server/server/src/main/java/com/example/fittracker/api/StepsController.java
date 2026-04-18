// imports to add:
import com.example.fittracker.domain.User;
import com.example.fittracker.repo.StepRecordRepo;
import com.example.fittracker.repo.UserRepo;
import java.time.LocalDate;

// inject repos via constructor
private final UserRepo users;
        private final StepRecordRepo stepRepo;

        public StepsController(UserRepo users, StepRecordRepo stepRepo){
            this.users = users; this.stepRepo = stepRepo;
        }

        @GetMapping("/today")
        public StepSummary today() {
            var user = users.findByUsername("demo").orElseThrow();
            var today = LocalDate.now();
            var steps = stepRepo.findByUserAndDate(user, today).map(StepRecord::getSteps).orElse(0);
            int goal = 10_000;
            return new StepSummary(steps, goal);
        }

        @GetMapping("/week")
        public List<StepDay> week() {
            var user = users.findByUsername("demo").orElseThrow();
            var end = LocalDate.now();
            var start = end.minusDays(6);
            var list = stepRepo.findByUserAndDateBetweenOrderByDateAsc(user, start, end);
            return list.stream()
                    .map(r -> new StepDay(r.getDate().toString(), r.getSteps()))
                    .toList();
        }
