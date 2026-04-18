// add imports:
import com.example.fittracker.repo.UserRepo;
import com.example.fittracker.repo.WorkoutLogRepo;

// inject
private final UserRepo users;
        private final WorkoutLogRepo workoutRepo;

        public WorkoutController(UserRepo users, WorkoutLogRepo workoutRepo){
            this.users = users; this.workoutRepo = workoutRepo;
        }

        @GetMapping
        public List<Workout> list() {
            var user = users.findByUsername("demo").orElseThrow();
            return workoutRepo.findTop10ByUserOrderByTimestampDesc(user).stream()
                    .map(w -> new Workout(w.getTitle(), w.getType(), w.getMinutes(), w.getCalories()))
                    .toList();
        }
