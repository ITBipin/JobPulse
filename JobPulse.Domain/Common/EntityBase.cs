namespace JobPulse.Domain.Common;

public abstract class EntityBase
{
    public Guid Id { get; protected set; } = Guid.NewGuid();
    public DateTime CreatedAtUtc { get; protected set; } = DateTime.UtcNow;
}
